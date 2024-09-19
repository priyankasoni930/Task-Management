"use client";

import { DragDropContext as BeautifulDND } from "react-beautiful-dnd";

export function DragDropContext({ children, ...props }) {
  return <BeautifulDND {...props}>{children}</BeautifulDND>;
}
