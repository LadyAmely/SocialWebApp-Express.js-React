import React from "react";
import { render, screen } from "@testing-library/react";
import FavouriteEvent from "../../../../../../pkg/atoms/pages/Event/components/FavouriteEvent";

describe("FavouriteEvent Component", () => {
    const mockProps = {
        user: {
            name: "Jane Doe",
            avatar: "https://via.placeholder.com/150",
            time: "2 hours ago",
        },
        content: "This is a test event.",
        image: "https://via.placeholder.com/300",
        title: "Stargazing Night",
        date: "2024-12-31",
        place: "Grand Canyon",
    };

    test("renders the event date", () => {
        render(<FavouriteEvent {...mockProps} />);

        expect(screen.getByText(mockProps.date)).toBeInTheDocument();
    });

    test("renders the event title", () => {
        render(<FavouriteEvent {...mockProps} />);

        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    });

    test("renders the event place", () => {
        render(<FavouriteEvent {...mockProps} />);

        expect(screen.getByText(mockProps.place)).toBeInTheDocument();
    });
});
