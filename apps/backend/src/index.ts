import { configurePort, createApp } from "@backend/init";

const port = configurePort();
const app = createApp();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
