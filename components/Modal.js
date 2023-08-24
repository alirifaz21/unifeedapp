import React, { useEffect, useRef } from 'react';
import { View, Modal as RNModal, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet } from 'react-native';


const Modal = ({ showModal, handleCloseModal, children }) => {
    const modalRef = useRef(null);

    const handleClickOutsideModal = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleCloseModal();
        }
    };

    useEffect(() => {
        if (showModal) {
            // Add event listener to listen for press events outside the modal
            const listener = (e) => handleClickOutsideModal(e.nativeEvent);
            modalRef.current.addEventListener('touchend', listener);

            // Remove the event listener when the component is unmounted or modal is closed
            return () => {
                modalRef.current.removeEventListener('touchend', listener);
            };
        }
    }, [showModal]);

    return (
        <RNModal
            transparent
            visible={showModal}
            onRequestClose={handleCloseModal}
        >
            <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View ref={modalRef} style={{ backgroundColor: 'white', padding: 20 }}>
                        {children}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    );
};



const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        maxWidth: 400,
        width: '100%',
    },
    close: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: 20,
        // Add more styles as needed
    },
    // Optional: Add some animation to the modal
    fadeIn: {
        animationDuration: '0.3s',
        animationName: 'fade-in',
    },
    '@keyframes fade-in': {
        from: {
            opacity: 0,
            transform: [{ translateY: -20 }],
        },
        to: {
            opacity: 1,
            transform: [{ translateY: 0 }],
        },
    },
});



export default Modal;
