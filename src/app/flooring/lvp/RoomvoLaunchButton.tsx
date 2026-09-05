'use client';

type RoomvoLaunchButtonProps = {
    label: string;
    className: string;
};

export default function RoomvoLaunchButton({ label, className }: RoomvoLaunchButtonProps) {
    const openRoomvo = () => {
        window.dispatchEvent(new CustomEvent('moliora:open-roomvo'));
    };

    return (
        <button type="button" onClick={openRoomvo} className={className}>
            {label}
        </button>
    );
}
