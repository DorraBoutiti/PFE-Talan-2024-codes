from flask import Flask, jsonify
import subprocess

app = Flask(__name__)


@app.route("/update-birthdate")
def update_birthdate():
    try:
        # Call the Java application
        result = subprocess.run(
            [
                "java",
                "-cp",
                "/app/libs/*:/app/java",
                "com.hraccess.openhr.samples.QuickStartSample",
            ],
            capture_output=True,
            text=True,
        )

        return jsonify(
            {
                "message": "Employee birthdate updated successfully",
                "output": result.stdout,
            }
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
