// // components/AccountDialog.tsx
// 'use client';

// import { useState } from 'react';
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useUser, useClerk } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { motion } from "framer-motion";
// import { 
//   User, 
//   CreditCard, 
//   Wallet, 
//   Shield, 
//   Video,
//   AlertCircle,
//   Timer,
//   Check,
//   ExternalLink
// } from "lucide-react";
// import { formatDistanceToNow } from 'date-fns';

// interface AccountDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   userDetails: {
//     credits: number;
//     subscription: boolean;
//     createdAt: Date;
//   };
// }

// export function AccountDialog({ isOpen, onClose, userDetails }: AccountDialogProps) {
//   const { user } = useUser();
//   const [activeTab, setActiveTab] = useState("profile");
//   const nextCreditReset = userDetails.subscription ? null : 
//     new Date(new Date().setMonth(new Date().getMonth() + 1));

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[872px] p-0 bg-background/95 backdrop-blur-xl border-border/40">
//         <div className="flex h-[600px]">
//           {/* Sidebar */}
//           <div className="w-[200px] border-r border-border/40 p-4 space-y-4">
//             <div className="space-y-2">
//               <h2 className="text-lg font-semibold">Account</h2>
//               <p className="text-sm text-muted-foreground">
//                 Manage your account settings
//               </p>
//             </div>
//             <Separator />
//             <TabsList className="flex flex-col items-start gap-1 bg-transparent">
//               <TabsTrigger
//                 value="profile"
//                 className="w-full justify-start gap-2 px-2 data-[state=active]:bg-primary/10"
//                 onClick={() => setActiveTab("profile")}
//               >
//                 <User size={16} />
//                 Profile
//               </TabsTrigger>
//               <TabsTrigger
//                 value="billing"
//                 className="w-full justify-start gap-2 px-2 data-[state=active]:bg-primary/10"
//                 onClick={() => setActiveTab("billing")}
//               >
//                 <CreditCard size={16} />
//                 Billing
//               </TabsTrigger>
//               <TabsTrigger
//                 value="credits"
//                 className="w-full justify-start gap-2 px-2 data-[state=active]:bg-primary/10"
//                 onClick={() => setActiveTab("credits")}
//               >
//                 <Wallet size={16} />
//                 Credits
//               </TabsTrigger>
//               {/* Add more tabs as needed */}
//             </TabsList>
//           </div>

//           {/* Content */}
//           <div className="flex-1 p-6">
//             <Tabs value={activeTab} className="h-full">
//               <TabsContent value="profile" className="h-full">
//                 <ProfileTab user={user} />
//               </TabsContent>
//               <TabsContent value="billing" className="h-full">
//                 <BillingTab subscription={userDetails.subscription} />
//               </TabsContent>
//               <TabsContent value="credits" className="h-full">
//                 <CreditsTab 
//                   credits={userDetails.credits} 
//                   isPaid={userDetails.subscription}
//                   nextReset={nextCreditReset}
//                 />
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Individual tab components will follow in the next part...