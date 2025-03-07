import React from "react";

const ErrorMessage = ({ error }: { error: string }) => {
  return <span className="text-red-500 text-sm">{error}</span>;
};

export default ErrorMessage;
