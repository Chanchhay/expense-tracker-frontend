type Props = {
    message?: string;
};

export default function ErrorMessage({
    message = "Something went wrong.",
}: Props) {
    return (
        <div className="p-6">
            <p>{message}</p>
        </div>
    );
}
