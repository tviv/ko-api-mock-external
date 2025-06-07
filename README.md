# ko-api-mock-external

This project provides a mock external API for testing and development purposes. Additionally, it integrates seamlessly with [Locust](https://locust.io/) for load testing, enabling users to simulate high-traffic scenarios and evaluate API performance.

## Features

- Simulates external API responses.
- Configurable endpoints and response data.
- Lightweight and easy to use.
- Supports integration with Locust for load testing.

## Installation

```bash
git clone https://github.com/your-repo/ko-api-mock-external.git
cd ko-api-mock-external
npm install
```

## Usage

Start the mock server:

```bash
npm start
```

By default, the server runs on `http://localhost:3000`.

## Configuration

Modify the `config.json` file to customize endpoints and responses.

## Load Testing with Locust

To perform load testing:

1. Install Locust by following the [official installation guide](https://docs.locust.io/en/stable/installation.html).
2. Create a `locustfile.py` to define user behavior for testing the mock API.
3. Run Locust and point it to the mock server's URL.

Example `locustfile.py`:

```python
from locust import HttpUser, task

class MockApiUser(HttpUser):
    @task
    def get_mock_data(self):
        self.client.get("/your-endpoint")
```

Start Locust:

```bash
locust
```

Access the Locust web interface at `http://localhost:8089` to configure and monitor the load test.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue.

## License

This project is licensed under the [MIT License](LICENSE).
