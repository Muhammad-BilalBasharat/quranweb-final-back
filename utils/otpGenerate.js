function generateOTP(n) {
    if (n <= 0) {
        throw new Error("Length of OTP must be greater than 0");
    }
    let otp = '';
    for (let i = 0; i < n; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

export default generateOTP;