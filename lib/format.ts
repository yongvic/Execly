/**
 * Format a number as FCFA currency
 * @param amount - The amount in FCFA
 * @returns Formatted string (e.g. "25 000 FCFA")
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        maximumFractionDigits: 0,
    }).format(amount) + ' FCFA';
}
