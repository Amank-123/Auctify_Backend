import mongoose from "mongoose";

export const runTransaction = async (callback, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const result = await callback(session);

            await session.commitTransaction();

            return result;
        } catch (error) {
            await session.abortTransaction();

            const isTransient =
                error?.errorLabels?.includes("TransientTransactionError") ||
                error?.errorLabels?.includes("UnknownTransactionCommitResult");

            if (!isTransient || attempt === retries) {
                throw error;
            }
        } finally {
            await session.endSession();
        }
    }
};
