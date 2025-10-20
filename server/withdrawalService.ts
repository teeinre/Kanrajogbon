
import { FlutterwaveService } from './flutterwaveService';
import { storage } from './storage';
import type { WithdrawalRequest } from '@shared/schema';

export interface WithdrawalProcessResult {
  success: boolean;
  withdrawalId: string;
  transferId?: string;
  reference?: string;
  message: string;
  error?: string;
}

export class WithdrawalService {
  private flutterwaveService: FlutterwaveService;

  constructor() {
    this.flutterwaveService = new FlutterwaveService();
  }

  async processWithdrawal(withdrawalId: string): Promise<WithdrawalProcessResult> {
    try {
      // Get withdrawal request
      const withdrawal = await this.getWithdrawalById(withdrawalId);
      if (!withdrawal) {
        return {
          success: false,
          withdrawalId,
          message: 'Withdrawal request not found',
          error: 'WITHDRAWAL_NOT_FOUND'
        };
      }

      if (withdrawal.status !== 'pending') {
        return {
          success: false,
          withdrawalId,
          message: `Withdrawal is already ${withdrawal.status}`,
          error: 'INVALID_STATUS'
        };
      }

      // Parse payment details
      const paymentDetails = typeof withdrawal.paymentDetails === 'string' 
        ? JSON.parse(withdrawal.paymentDetails) 
        : withdrawal.paymentDetails;

      if (!paymentDetails || !paymentDetails.accountNumber || !paymentDetails.bankName || !paymentDetails.accountHolder) {
        return {
          success: false,
          withdrawalId,
          message: 'Invalid payment details',
          error: 'INVALID_PAYMENT_DETAILS'
        };
      }

      // Get bank code
      const bankCode = await this.flutterwaveService.getBankCode(paymentDetails.bankName);
      if (!bankCode) {
        return {
          success: false,
          withdrawalId,
          message: `Bank code not found for ${paymentDetails.bankName}`,
          error: 'BANK_CODE_NOT_FOUND'
        };
      }

      // Generate transfer reference
      const transferReference = this.flutterwaveService.generateTransferReference(withdrawal.finderId);

      // Convert amount to number and ensure it's in kobo (if amount is in naira, multiply by 100)
      const amountInKobo = Math.round(parseFloat(withdrawal.amount) * 100);

      // Initiate bank transfer
      const transferResult = await this.flutterwaveService.initiateBankTransfer(
        paymentDetails.accountNumber,
        bankCode,
        amountInKobo,
        'NGN',
        `FinderMeister withdrawal - ${withdrawal.requestId || withdrawalId}`,
        transferReference,
        paymentDetails.accountHolder
      );

      // Update withdrawal status to processing
      await storage.updateWithdrawalRequest(withdrawalId, {
        status: 'processing',
        processedAt: new Date(),
        adminNotes: `Transfer initiated via Flutterwave. Transfer ID: ${transferResult.id}, Reference: ${transferReference}`
      });

      console.log(`Withdrawal ${withdrawalId} processed successfully. Transfer ID: ${transferResult.id}`);

      return {
        success: true,
        withdrawalId,
        transferId: transferResult.id,
        reference: transferReference,
        message: 'Withdrawal processed successfully'
      };

    } catch (error: any) {
      console.error(`Error processing withdrawal ${withdrawalId}:`, error);
      
      // Update withdrawal status to failed
      try {
        await storage.updateWithdrawalRequest(withdrawalId, {
          status: 'rejected',
          processedAt: new Date(),
          adminNotes: `Failed to process withdrawal: ${error.message}`
        });
      } catch (updateError) {
        console.error('Failed to update withdrawal status:', updateError);
      }

      return {
        success: false,
        withdrawalId,
        message: 'Failed to process withdrawal',
        error: error.message
      };
    }
  }

  async handleTransferWebhook(transferData: any): Promise<void> {
    try {
      const { reference, status, id: transferId } = transferData;
      
      if (!reference) {
        console.warn('Transfer webhook received without reference');
        return;
      }

      // Find withdrawal by reference in admin notes
      const withdrawals = await storage.getWithdrawalRequests();
      const withdrawal = withdrawals.find(w => 
        w.adminNotes && w.adminNotes.includes(reference)
      );

      if (!withdrawal) {
        console.warn(`Withdrawal not found for transfer reference: ${reference}`);
        return;
      }

      let newStatus = 'processing';
      let adminNotes = withdrawal.adminNotes || '';

      if (status === 'SUCCESSFUL') {
        newStatus = 'approved';
        adminNotes += ` | Transfer completed successfully at ${new Date().toISOString()}`;
      } else if (status === 'FAILED') {
        newStatus = 'rejected';
        adminNotes += ` | Transfer failed at ${new Date().toISOString()}. Reason: ${transferData.failure_reason || 'Unknown'}`;
      }

      await storage.updateWithdrawalRequest(withdrawal.id, {
        status: newStatus,
        adminNotes: adminNotes
      });

      console.log(`Withdrawal ${withdrawal.id} status updated to ${newStatus} based on transfer webhook`);

    } catch (error) {
      console.error('Error handling transfer webhook:', error);
    }
  }

  async retryFailedWithdrawal(withdrawalId: string, adminUserId: string): Promise<WithdrawalProcessResult> {
    try {
      // Reset withdrawal to pending status
      await storage.updateWithdrawalRequest(withdrawalId, {
        status: 'pending',
        processedBy: adminUserId,
        adminNotes: `Retry initiated by admin at ${new Date().toISOString()}`
      });

      // Process the withdrawal again
      return await this.processWithdrawal(withdrawalId);
    } catch (error: any) {
      console.error(`Error retrying withdrawal ${withdrawalId}:`, error);
      return {
        success: false,
        withdrawalId,
        message: 'Failed to retry withdrawal',
        error: error.message
      };
    }
  }

  private async getWithdrawalById(withdrawalId: string): Promise<WithdrawalRequest | undefined> {
    const withdrawals = await storage.getWithdrawalRequests();
    return withdrawals.find(w => w.id === withdrawalId);
  }
}
