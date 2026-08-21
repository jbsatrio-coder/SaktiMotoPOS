function inspectPurchaseSubmissionIdPayloadForTest_(payload) {
    return {
        submissionId : String(payload && payload.submissionId || "").trim()
    };
}

function runPurchaseSubmissionIdPayloadSmokeCli() {
    const submissionId = "purchase-ui-smoke-" + Utilities.getUuid();
    const received = inspectPurchaseSubmissionIdPayloadForTest_({
        submissionId : submissionId,
        supplier : "SMOKE",
        noFaktur : "SMOKE",
        admin : "SMOKE",
        keterangan : "payload only",
        items : []
    });

    if (received.submissionId !== submissionId) {
        throw new Error("submissionId tidak diterima utuh oleh adapter smoke.");
    }

    return {
        success : true,
        submissionId : received.submissionId,
        message : "PURCHASE SUBMISSION ID PAYLOAD PASS"
    };
}
