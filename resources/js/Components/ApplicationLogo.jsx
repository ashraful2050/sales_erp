export default function ApplicationLogo({ className, ...props }) {
    return (
        <img
            src="/logo.svg"
            alt="AccounTech BD"
            className={className}
            {...props}
        />
    );
}
