export function getToken(bearerToken: string): string | null {
    if (bearerToken && typeof bearerToken === 'string') {
        const parts = bearerToken.trim().split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            return parts[1].trim();
        }
    }
    return null;
}