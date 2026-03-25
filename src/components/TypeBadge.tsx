import styles from './TypeBadge.module.scss';
interface TypeBadgeProps{
    typeName : string;
}

export default function TypeBadge({typeName} : TypeBadgeProps){
    return (
    <span className={`${styles.badge} ${styles[typeName] ?? ''}`}>
      {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
    </span>
  );
}