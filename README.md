
# Running with Docker (how this was built)
1. Include a *.env* at the root of the repo with the following structure:

2. Run `docker compose up --build`
3. Run: `docker exec -it nextjs_app sh` to get inside the node container, and in there run:
```docker exec -it nextjs_app sh
npm run drizzle:generate && npm run drizzle:push
```
4. In your browser navigate to `http://localhost:3000`