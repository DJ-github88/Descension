const LOCAL_ROOM_CHANGE_EVENT = 'mythrill:local-room-change';

const dispatchLocalRoomChange = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(LOCAL_ROOM_CHANGE_EVENT));
    }
};

export const setLocalRoom = (roomId) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('selectedLocalRoomId', roomId);
    localStorage.setItem('isLocalRoom', 'true');
    dispatchLocalRoomChange();
};

export const clearLocalRoom = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('isLocalRoom');
    localStorage.removeItem('selectedLocalRoomId');
    dispatchLocalRoomChange();
};

export { LOCAL_ROOM_CHANGE_EVENT };
