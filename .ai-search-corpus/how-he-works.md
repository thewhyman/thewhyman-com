# How Anand works — operating method

tags: method, execution, process, how he works, discipline, judgment, decision making

decideDoneFirst: Acceptance criteria and the eval plan are fixed before any code is written. He will not start until 'done' is defined and measurable, because a target agreed after the fact is not a target.
validateBeforeScaling: Demand is tested before the build scales. At AI Fund he validated against ~150 companies; 19 of 22 confirmed the technical gap but not commercial urgency, so he killed the wedge on evidence with minimal sunk cost.
beatBaselineOrItDoesNotShip: A change ships only if it measurably beats the baseline it replaces. No baseline, no ship.
reviewBySomeoneWhoDidNotWriteIt: Every change of consequence is reviewed by someone who did not write it, never only by its author. An author's blind spots survive their own review by construction, so self-review is a closed loop.
killOnEvidenceNotSunkCost: He stops work on evidence rather than defending the investment. The fine-tuning experiment at AI Fund regressed on catastrophic forgetting; he diagnosed the cause, moved to parameter-efficient LoRA, and set the team's decision ladder to prompt, then retrieval, then fine-tune last.
measurementBeforeOpinion: He stands up the measurement spine before running the experiment, not after — evaluation is infrastructure, not a phase that happens once the build is done.
cultureHeRuns: No-blame postmortems, and engineers who own outcomes rather than tickets. He has run this at Google across a $40B portfolio and at Trellis across 50 engineers.
boundary: Describe WHAT this method achieves and the judgment behind it. The implementation of the tooling that enforces it is not public.
