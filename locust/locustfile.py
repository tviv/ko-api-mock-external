from locust import HttpUser, task, between, events

TOTAL_REQUESTS = 100  # total requests across all users
request_counter = 0

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)
    phone_number = 12340000001  # Starting phone number
    max_requests = 100  # Set the maximum number of requests
    request_count = 0  # Initialize the request counter

    # @events.request.add_listener
    # def on_request(request_type, name, response_time, response_length, response, context, exception, **kwargs):
    #     global request_counter
    #     request_counter += 1
    #     if request_counter >= TOTAL_REQUESTS:
    #         # Stop the whole test
    #         import gevent
    #         gevent.spawn_later(0, lambda: events.quitting.fire(environment=None, reverse=True))

    # @task
    # def send_message(self):
    #     self.client.post("/whatsapp/v2/sendMessage", json={
    #         "apiKey": "6cea6662-14e2-4ba2-9763-5bfa9b60f979",
    #         "from": "972779031419",
    #         "to": str(self.phone_number),
    #         "body": "hi test"
    #     })
    #     QuickstartUser.phone_number += 1  # Increment phone number for the next request

    @task
    def send_template_message(self):
        # if QuickstartUser.request_count >= QuickstartUser.max_requests:
        #     raise StopUser()

        self.client.post("/whatsapp/v2/sendTemplate", json={
            "apiKey": "6cea6662-14e2-4ba2-9763-5bfa9b60f979",
            "from": "972779031419",
            "to": str(self.phone_number),
            "name": "start_conversation",
            "language": 1,
            "headerType": 1,
            "bodyVariable1": "11",
            "bodyVariable2": "22",
        })
        #raise StopUser()
        QuickstartUser.phone_number += 1  # Increment phone number for the next request
        #QuickstartUser.request_count += 1  # Increment the request counter        