const InputGroup = ({
    register,
    errors,
    id,
    type,
    labelText,
    labelClass,
    inputClass,
    groupClass,
    rules,
    children,
    placeholder,
}) => {
    return (
        <div className={groupClass}>
            <label htmlFor={id} className={labelClass}>
                {labelText}
                {children}
            </label>
            <input
                type={type}
                id={id}
                className={`${inputClass} ${errors?.[id]?.message ? 'is-invalid' : ''}`}
                {...register(id, rules)}
                placeholder={placeholder}
            />
            {errors?.[id]?.message ? <span className='invalid-feedback'>{errors?.[id]?.message}</span> : null}
        </div>
    );
};
export default InputGroup;
