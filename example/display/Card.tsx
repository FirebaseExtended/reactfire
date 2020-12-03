import * as React from 'react';

export const Card = ({ children, title }: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="max-w-sm w-full rounded shadow-xl m-2">
      <div className="h-12 bg-blue-200 p-2 rounded-t ">
        <h2 className="text-lg">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export const CardSection = ({ children, title }: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="w-full">
      <div className="h-10 bg-blue-100 p-2">
        <h3>{title}</h3>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
};
