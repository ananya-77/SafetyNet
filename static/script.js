document.addEventListener("DOMContentLoaded", function () {
    const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("audioFile");
    const resultDiv = document.getElementById("result");
    const reportSection = document.getElementById("reportSection");

    // Load Reports from MongoDB
    function loadReports() {
        fetch("/get_reports")
            .then(response => response.json())
            .then(data => {
                reportSection.innerHTML = "<h3>Previous Detections:</h3>";
                if (data.length === 0) {
                    reportSection.innerHTML += "<p>No reports found.</p>";
                } else {
                    reportSection.innerHTML += data.map(report => `<p>${report.result} - ${new Date(report.createdAt).toLocaleString()}</p>`).join("");
                }
            })
            .catch(error => console.error("Error loading reports:", error));
    }

    // Load reports when page opens
    loadReports();

    uploadForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let file = fileInput.files[0];
        if (!file) {
            alert("Please upload an audio file first.");
            return;
        }

        let formData = new FormData();
        formData.append("audio", file);

        resultDiv.innerHTML = "<p style='color: blue;'>Processing...</p>";

        fetch("/predict", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultDiv.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
            } else {
                resultDiv.innerHTML = `<p style="color: green;">${data.prediction}</p>`;
                loadReports(); // Refresh reports after new prediction
            }
        })
        .catch(error => {
            console.error("Error:", error);
            resultDiv.innerHTML = `<p style="color: red;">An error occurred.</p>`;
        });
    });
});
