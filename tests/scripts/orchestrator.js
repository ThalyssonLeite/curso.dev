import retry from "async-retry";

async function waitForAllServices() {
  return waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, { retries: 100, maxTimeout: 1_000 });

    async function fetchStatusPage() {
      const STATUS_PAGE_URL = "http://localhost:3000/api/v1/status";
      const statusPageResponse = await fetch(STATUS_PAGE_URL);
      if (!statusPageResponse.ok) throw new Error();
    }
  }
}

const orchestrator = {
  waitForAllServices,
};

export default orchestrator;
