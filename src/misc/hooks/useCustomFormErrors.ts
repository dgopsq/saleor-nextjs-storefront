import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { z } from "zod";

/**
 *
 */
export function useCustomFormErrors() {
  const t = useTranslations("Form");

  const errorsMap = useCallback<z.ZodErrorMap>(
    ({ code }) => ({ message: t(code) }),
    [t]
  );

  useEffect(() => {
    z.setErrorMap(errorsMap);
  }, [errorsMap]);
}
