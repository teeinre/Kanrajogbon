import React from 'react';

interface VerificationStatusBadgeProps {
  status: string | undefined;
  className?: string;
  showIcon?: boolean;
}

export function VerificationStatusBadge({ status, className = '', showIcon = true }: VerificationStatusBadgeProps) {
  const getStatusConfig = (verificationStatus: string | undefined) => {
    switch (verificationStatus) {
      case 'verified':
        return {
          text: 'Verified',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '✓'
        };
      case 'pending':
        return {
          text: 'Under Review',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '⏳'
        };
      case 'rejected':
        return {
          text: 'Rejected',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '✗'
        };
      default:
        return {
          text: 'Not Verified',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '○'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.text}
    </span>
  );
}

interface SimpleVerificationStatusProps {
  isVerified: boolean | undefined;
  className?: string;
}

export function SimpleVerificationStatus({ isVerified, className = '' }: SimpleVerificationStatusProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      isVerified 
        ? 'bg-green-50 border-green-200 text-green-600' 
        : 'bg-gray-50 border-gray-200 text-gray-600'
    } ${className}`}>
      {isVerified ? '✓ Verified' : '○ Not Verified'}
    </span>
  );
}