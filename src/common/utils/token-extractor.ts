export function getToken(bearerToken: string): string | null {
    if (bearerToken) {
        const token = bearerToken.split(' ')[1];
        return token;
    }
    return null;
}