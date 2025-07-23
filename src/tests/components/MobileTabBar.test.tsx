import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  MobileTabBar,
  TabItem,
} from "../../components/platform/mobile/MobileTabBar";

// Mock the platform hook
jest.mock("../../hooks/usePlatform", () => ({
  usePlatform: () => ({
    isIOS: true,
    isAndroid: false,
    isWeb: false,
    isMobile: true,
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

const mockTabItems: TabItem[] = [
  {
    id: "home",
    label: "Home",
    icon: <span data-testid="home-icon">🏠</span>,
  },
  {
    id: "games",
    label: "Games",
    icon: <span data-testid="games-icon">🎮</span>,
    badge: 3,
  },
  {
    id: "profile",
    label: "Profile",
    icon: <span data-testid="profile-icon">👤</span>,
  },
];

describe("MobileTabBar", () => {
  const mockOnTabChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all tab items", () => {
    render(
      <MobileTabBar
        items={mockTabItems}
        activeTabId="home"
        onTabChange={mockOnTabChange}
      />
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    expect(screen.getByTestId("games-icon")).toBeInTheDocument();
    expect(screen.getByTestId("profile-icon")).toBeInTheDocument();
  });

  it("displays badges correctly", () => {
    render(
      <MobileTabBar
        items={mockTabItems}
        activeTabId="home"
        onTabChange={mockOnTabChange}
      />
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calls onTabChange when a tab is pressed", () => {
    render(
      <MobileTabBar
        items={mockTabItems}
        activeTabId="home"
        onTabChange={mockOnTabChange}
      />
    );

    fireEvent.click(screen.getByText("Games"));
    expect(mockOnTabChange).toHaveBeenCalledWith("games");
  });

  it("calls onClick callback when tab item has one", () => {
    const mockOnClick = jest.fn();
    const itemsWithCallback = [
      ...mockTabItems,
      {
        id: "settings",
        label: "Settings",
        icon: <span>⚙️</span>,
        onClick: mockOnClick,
      },
    ];

    render(
      <MobileTabBar
        items={itemsWithCallback}
        activeTabId="home"
        onTabChange={mockOnTabChange}
      />
    );

    fireEvent.click(screen.getByText("Settings"));
    expect(mockOnClick).toHaveBeenCalled();
    expect(mockOnTabChange).toHaveBeenCalledWith("settings");
  });

  it("applies active state to the correct tab", () => {
    render(
      <MobileTabBar
        items={mockTabItems}
        activeTabId="games"
        onTabChange={mockOnTabChange}
      />
    );

    // Check that the games tab has the active class
    const gamesButton = screen.getByText("Games").closest("button");
    expect(gamesButton).toHaveClass("active");
  });

  it("renders iOS-specific classes", () => {
    const { container } = render(
      <MobileTabBar
        items={mockTabItems}
        activeTabId="home"
        onTabChange={mockOnTabChange}
      />
    );

    expect(container.querySelector(".ios-tab-bar")).toBeInTheDocument();
    expect(
      container.querySelector(".ios-tab-bar-background")
    ).toBeInTheDocument();
  });
});
