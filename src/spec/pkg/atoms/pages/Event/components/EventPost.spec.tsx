import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FaUser } from "react-icons/fa";
import EventPost from "../../../../../../pkg/atoms/pages/Event/components/EventPost";

describe("EventPost Component", () => {
    const mockProps = {
        user: {
            name: "John Doe",
            avatar: <FaUser />,
            time: "2 hours ago",
        },
        content: "This is a test event post.",
        image: "https://via.placeholder.com/150",
        event_id: 1,
    };

    test("renders user information correctly", () => {
        render(<EventPost {...mockProps} />);

        expect(screen.getByText(mockProps.user.name)).toBeInTheDocument();
        expect(screen.getByText(mockProps.user.time)).toBeInTheDocument();
    });

    test("renders post content correctly", () => {
        render(<EventPost {...mockProps} />);


        expect(screen.getByText(mockProps.content)).toBeInTheDocument();
    });


    test("renders action buttons with correct text and icons", () => {
        render(<EventPost {...mockProps} />);

        const actions = ["Interested", "Calendar", "Share"];
        actions.forEach((action) => {
            expect(screen.getByText(action)).toBeInTheDocument();
        });
    });

    test("triggers button click events", () => {
        render(<EventPost {...mockProps} />);

        const buttons = screen.getAllByRole("button");
        buttons.forEach((button) => {
            fireEvent.click(button);
            expect(button).toBeEnabled();
        });
    });
});
