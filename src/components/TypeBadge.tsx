interface TypeBadgeProps{
    typeName : string;
}

export default function TypeBadge({typeName} : TypeBadgeProps){
    return(
        <span>{typeName.charAt(0).toUpperCase() + typeName.slice(1)}</span>
    )
}