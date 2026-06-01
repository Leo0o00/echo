"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/dashboard/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/dashboard/files",
    icon: LibraryBigIcon,
  },
]

const configurationsItems = [
  {
    title: "Widget Customization",
    url: "/dashboard/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/dashboard/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/dashboard/plugins/vapi",
    icon: Mic,
  },
]

const accountItems = [
  {
    title: "Plans & Billing",
    url: "/dashboard/billing",
    icon: CreditCardIcon,
  },
]

export const DashboardSidebar = () => {
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }

    return pathname.startsWith(url)
  }

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <OrganizationSwitcher
                hidePersonal
                skipInvitationScreen
                appearance={{
                  elements: {
                    rootBox: "w-full! h-8!",
                    avatarBox: "size-4! rounded-sm!",
                    organizationSwitcherTrigger:
                      "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                    organizationPreview:
                      "group-data-[collapsible=icon]:justify-center! gap-2!",
                    organizationPreviewTextContainer:
                      "group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
                    organizationSwitcherTriggerIcon:
                      "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!",
                  },
                }}
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Customer support */}
        <SidebarGroup>
          <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerSupportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Configuration */}
        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configurationsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Account */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "w-full! h-8!",
                  useButtonTrigger:
                    "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                  userButtonBox:
                    "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                  userButtonOuterIdentifier:
                    "pl-0! group-data-[collapsible=icon]:hidden!",
                  avatarBox: "size-4",
                },
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
