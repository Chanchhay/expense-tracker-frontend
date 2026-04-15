type Props = {
    message?: string;
};

export default function Loading({ message = "Loading..." }: Props) {
    return (
        <div className="p-6">
            <p>{message}</p>
        </div>
    );
}
