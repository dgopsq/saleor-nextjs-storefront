/**
 *
 */
export type AsyncData<T, E extends Error = Error> =
  | {
      kind: "NotAsked";
    }
  | {
      kind: "Loading";
    }
  | {
      kind: "Success";
      data: T;
    }
  | {
      kind: "Failure";
      error: E;
    };
