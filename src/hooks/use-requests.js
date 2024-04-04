import { Auth } from "aws-amplify";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { snackbarActions } from "../Store/snackbar";

const microMap = {
  main: process.env.MAIN_API,
  admin: process.env.ADMIN_API,
};

const useRequest = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendRequest = useCallback(
    async (requestConfig, applyData) => {
      let baseURL = microMap.main;
      setIsLoading(true);
      if (requestConfig.service) {
        if (
          Object.prototype.hasOwnProperty.call(microMap, requestConfig.service)
        ) {
          baseURL = microMap[requestConfig.service];
        } else {
          throw new Error("Service not found");
        }
      }
      try {
        const response = await fetch(
          `${baseURL}${requestConfig.url}?` +
            (requestConfig.params
              ? new URLSearchParams(requestConfig.params)
              : ""),
          {
            method: requestConfig.method ? requestConfig.method : "GET",
            headers: {
              Authorization: `Bearer ${(await Auth.currentSession())
                .getIdToken()
                .getJwtToken()}`,
              ...requestConfig.headers,
              ...(requestConfig.method === "POST" ? {"Content-Type" : "application/json", "Accept" : "application/json"} : {}),
            },
            body: requestConfig.body
              ? JSON.stringify(requestConfig.body)
              : null,
          }
        );
        const responseBody = await response.json();
        if (!response.ok) {
          throw new Error(responseBody.detail);
        } else if (applyData) {
          applyData(responseBody);
        }
        if (requestConfig.success) {
          dispatch(
            snackbarActions.showNotification({
              snackbarOpen: true,
              snackbarType: "success",
              snackbarMessage:
                typeof requestConfig.success === "string"
                  ? requestConfig.success
                  : typeof responseBody === "string"
                  ? responseBody
                  : "Success",
            })
          );
        }
      } catch (err) {
        dispatch(
          snackbarActions.showNotification({
            snackbarOpen: true,
            snackbarType: "error",
            snackbarMessage: err.message,
          })
        );
        setError(err.message || "Something went wrong!");
      }
    },
    [dispatch]
  );
  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useRequest;
