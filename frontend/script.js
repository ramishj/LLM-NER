document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt");
  const sendButton = document.getElementById("sendBtn");
  const entitiesDiv = document.getElementById("entities");
  const llmResponseDiv = document.getElementById("llmResponse");

  // Add loading state
  function setLoading(isLoading) {
    sendButton.disabled = isLoading;
    sendButton.textContent = isLoading ? "Analyzing..." : "Analyze";
  }

  // Format entities with tooltips
  function formatEntities(prompt, entities) {
    let result = "";
    let lastIndex = 0;

    // Sort entities by start position
    entities.sort((a, b) => a.start - b.start);

    entities.forEach((entity) => {
      // Add text before the entity
      result += prompt.slice(lastIndex, entity.start);

      // Add the entity with tooltip
      result += `<span class="entity" title="${entity.label}">${entity.text}</span>`;

      lastIndex = entity.end;
    });

    // Add remaining text
    result += prompt.slice(lastIndex);

    return result || "No entities detected";
  }

  // Handle the analyze button click
  sendButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      alert("Please enter a prompt");
      return;
    }

    setLoading(true);
    entitiesDiv.innerHTML = "";
    llmResponseDiv.innerHTML = "";

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Display entities
      entitiesDiv.innerHTML = formatEntities(prompt, data.entities);

      // Display LLM response
      llmResponseDiv.textContent = data.llm_response || "No response from LLM";
    } catch (error) {
      console.error("Error:", error);
      entitiesDiv.innerHTML = "Error analyzing text";
      llmResponseDiv.textContent = "Error getting LLM response";
    } finally {
      setLoading(false);
    }
  });

  // Allow Enter key to submit (Shift+Enter for new line)
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendButton.click();
    }
  });
});
