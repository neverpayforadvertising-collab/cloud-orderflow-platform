export const logger = (event: string, context: Record<string, unknown>) => {
  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...context
  };

  console.log(JSON.stringify(payload));
};
