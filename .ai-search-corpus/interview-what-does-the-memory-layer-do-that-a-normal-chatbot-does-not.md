# What does the memory layer do that a normal chatbot does not?

tags: interview question, fit, screening, What does the memory layer do that a normal chatbot does not?

An LLM has zero persistent memory between turns or sessions. The memory subsystem sits inside the harness as the context controller: on pre-prompt hooks it searches its index and injects relevant history into the active context; on session end it distills new facts and lessons into a long-term index. That solves both failure modes at once — amnesia across sessions, and context windows blown out by irrelevant history.
