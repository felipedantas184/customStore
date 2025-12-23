import { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Container>
      <Navbar toggle={toggleSidebar} />
      <Content>
        <SidebarContainer isOpen={isSidebarOpen}>
          <Sidebar />
        </SidebarContainer>
        <MainContent onClick={() => isSidebarOpen && setIsSidebarOpen(false)}>
          {children}
        </MainContent>
      </Content>
    </Container>
  );
};

export default DashboardLayout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  height: calc(100% - 60px);
`;

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  transition: transform 0.3s ease-in-out;
  background-color: #fff;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    width: 220px;
    height: calc(100% - 60px);
    z-index: 1000;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-120%)"};
    box-shadow: ${({ isOpen }) =>
      isOpen ? "2px 0 10px rgba(0,0,0,0.3)" : "none"};
  }

  @media (min-width: 769px) {
    transform: translateX(0);
    min-width: 250px;
  }
`;

const MainContent = styled.main`
  flex: 1;
  background-color: #fff;
  border-radius: 10px 0 0 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;