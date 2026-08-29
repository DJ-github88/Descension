// Window introductions have been permanently removed.
export const useWindowIntros = () => {
    return {
        enabled: false,
        seenCount: 0,
        total: 0,
        triggerIfFirstOpen: () => {},
        resetSeen: () => {},
        setEnabled: () => {}
    };
};

export default useWindowIntros;
