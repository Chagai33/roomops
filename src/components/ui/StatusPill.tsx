import React from 'react';
import type { RoomStatus } from '../../store/usePropertyStore';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  status: RoomStatus;
}

export const StatusPill: React.FC<Props> = ({ status }) => {
  const { t } = useAppStore();
  
  let styles = '';
  let label = '';
  
  switch (status) {
    case 'READY':
      styles = 'bg-[#d8f5eb] text-[#005236]';
      label = t.dashboard.statusReady;
      break;
    case 'CLEANING':
      styles = 'bg-[#e0f2fe] text-[#0369a1]';
      label = t.dashboard.statusCleaning;
      break;
    case 'MAINTENANCE':
    case 'UNAVAILABLE':
      styles = 'bg-[#fee2e2] text-[#991b1b]';
      label = t.dashboard.statusMaintenance;
      break;
  }

  return (
    <span className={`status-pill ${styles}`}>
      {label}
    </span>
  );
};
