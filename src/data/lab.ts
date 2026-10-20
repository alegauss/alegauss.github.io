/* Figures the method page quotes (AG11). Every one is copied from a Lab write-up,
   with the sentence it came from and a link to it: the page claims nothing else. */

export interface LabFigure {
  project: "claude-code-time-study" | "claude-code-usage"
  value: string
  label: string
  quote: string
  url: string
}

export const LAB_FIGURES: LabFigure[] = [
  {
    project: "claude-code-time-study",
    value: "530 h",
    label: "of attributed time, across 556 sessions in 59 days",
    quote: "59 calendar days, 556 sessions, 31 projects, 530 hours of attributed time",
    url: "https://github.com/alegauss/claude-code-time-study#result-on-the-measured-sample",
  },
  {
    project: "claude-code-time-study",
    value: "11.2%",
    label: "of active time went to authoring the feature",
    quote: "feature authoring is 11.2%, less than half the expected share",
    url: "https://github.com/alegauss/claude-code-time-study#result-on-the-measured-sample",
  },
  {
    project: "claude-code-time-study",
    value: "27.3%",
    label: "went to writing and running tests",
    quote: "Tests (writing + running) | 124 | 27.3%",
    url: "https://github.com/alegauss/claude-code-time-study#result-on-the-measured-sample",
  },
  {
    project: "claude-code-usage",
    value: "1,864",
    label: "tasks measured, over 79,377 requests in 32 active days",
    quote: "The current snapshot covers 1,864 tasks and 79,377 requests over 32 active days.",
    url: "https://github.com/alegauss/claude-code-usage#measuring-instead-of-assuming",
  },
  {
    project: "claude-code-usage",
    value: "$777",
    label: "for the most expensive five-hour window on record, at list prices",
    quote: "the most expensive five-hour window on record cost $777 at list prices with work uninterrupted",
    url: "https://github.com/alegauss/claude-code-usage#assumptions-stated-so-you-can-disagree-with-them",
  },
]
