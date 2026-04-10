

import crypto from "crypto";
const generateSignature = () => {
    const body = "order_Sau2iQtUnP6OCn" + "|" + "69d5f85f428b1f6e06535e3b";

    const sign = crypto
        .createHmac("sha256", "USJp62cJUniMiwkKXJ6N3Fh5")
        .update(body)
        .digest("hex");

    return sign;
};

console.log(generateSignature());

