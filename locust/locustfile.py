from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(1, 2)

    #def on_start(self):
        #self.client.post("/login", json={"username":"foo", "password":"bar"})

    @task
    def send_message(self):
        self.client.post("/whatsapp/v2/sendMessage", json={"apiKey": "6cea6662-14e2-4ba2-9763-5bfa9b60f979", "from": "972779031419", "to": "79622237668", "body": "hi test"})
        #self.client.get("/world")

#     @task(3)
#     def view_item(self):
#         for item_id in range(10):
#             self.client.get(f"/item?id={item_id}", name="/item")
