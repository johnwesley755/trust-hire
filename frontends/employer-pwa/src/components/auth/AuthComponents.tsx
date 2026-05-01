import React from 'react';
import { useAppSelector } from '../../store';

export const SignedIn = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAppSelector((state) => state.auth);
    return token ? <>{children}</> : null;
};

export const SignedOut = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAppSelector((state) => state.auth);
    return !token ? <>{children}</> : null;
};
