function GetRandomNumberInBetween(num1, num2) {
    const min = Math.min(num1, num2);
    const max = Math.max(num1, num2);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export { GetRandomNumberInBetween };
