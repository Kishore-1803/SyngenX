import React from 'react';
import styles from "../styles/components/accountCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface AccountLinkCardProps {
  name: string;
  provider: string;
  linked: boolean;
  onClick: () => void;
  onUnlink: () => void;
  icon: IconDefinition; // <-- Change from string to IconDefinition
  description: string;
}

export default function AccountLinkCard({
  name,
  provider,
  linked,
  onClick,
  onUnlink,
  icon,
  description
}: AccountLinkCardProps) {
  const handleClick = () => {
    if (linked) {
      onUnlink();
    } else {
      onClick();
    }
  };

  const cardClasses = [
    styles.card,
    linked ? styles.linked : '',
    provider.toLowerCase()
  ].filter(Boolean).join(' ');

  const statusIconClasses = [
    styles['status-icon'],
    linked ? styles.linked : ''
  ].filter(Boolean).join(' ');

  const buttonClasses = [
    linked ? styles.unlink : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      <div className={statusIconClasses}>
        <FontAwesomeIcon icon={icon} size="2x" />
      </div>

      <h4>{name}</h4>
      
      <p className={styles.description}>{description}</p>

      {linked && (
        <div className={styles['linked-status']}>
          Connected to {provider}
        </div>
      )}

      <button
        className={buttonClasses}
        onClick={handleClick}
        aria-label={linked ? `Disconnect from ${name}` : `Connect to ${name}`}
      >
        <FontAwesomeIcon icon={linked ? ["fas", "unlink"] : ["fas", "link"]} />
        {linked ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}