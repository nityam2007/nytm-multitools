// MAC Address Lookup Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("mac-lookup")!;
const similarTools = getToolsByCategory("network").filter(t => t.slug !== "mac-lookup");

interface VendorInfo {
  prefix: string;
  vendor: string;
  country?: string;
}

// Comprehensive OUI database (subset of most common manufacturers)
const ouiDatabase: VendorInfo[] = [
  // Apple
  { prefix: "00:03:93", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:05:02", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:0A:27", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:0A:95", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:0D:93", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:10:FA", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:11:24", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:14:51", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:16:CB", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:17:F2", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:19:E3", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1B:63", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1C:B3", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1D:4F", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1E:52", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1E:C2", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1F:5B", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:1F:F3", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:21:E9", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:22:41", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:23:12", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:23:32", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:23:6C", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:23:DF", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:24:36", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:25:00", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:25:4B", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:25:BC", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:26:08", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:26:4A", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:26:B0", vendor: "Apple, Inc.", country: "US" },
  { prefix: "00:26:BB", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:0C:CE", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:15:52", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:1E:64", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:26:65", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:48:9A", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:52:F3", vendor: "Apple, Inc.", country: "US" },
  { prefix: "04:54:53", vendor: "Apple, Inc.", country: "US" },
  { prefix: "08:66:98", vendor: "Apple, Inc.", country: "US" },
  
  // Samsung
  { prefix: "00:00:F0", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:02:78", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:07:AB", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:09:18", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:0D:AE", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:0D:E5", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:12:47", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:12:FB", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:13:77", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:15:99", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:15:B9", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:16:32", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:16:6B", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:16:6C", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:16:DB", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:17:C9", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:17:D5", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:18:AF", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1A:8A", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1B:98", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1C:43", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1D:25", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1D:F6", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1E:7D", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1F:CC", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:1F:CD", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:21:19", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:21:4C", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:21:D1", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:21:D2", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:23:39", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:23:3A", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:23:99", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:23:D6", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:23:D7", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:24:54", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:24:90", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:24:91", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:25:66", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  { prefix: "00:25:67", vendor: "Samsung Electronics Co.,Ltd", country: "KR" },
  
  // Intel
  { prefix: "00:02:B3", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:03:47", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:04:23", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:07:E9", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:0C:F1", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:0E:0C", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:0E:35", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:11:11", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:12:F0", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:13:02", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:13:20", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:13:CE", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:13:E8", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:15:00", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:15:17", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:16:6F", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:16:76", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:16:EA", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:16:EB", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:17:35", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:18:DE", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:19:D1", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:19:D2", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1B:21", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1B:77", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1C:BF", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1C:C0", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1D:E0", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1E:64", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1E:65", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1E:67", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1F:3B", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:1F:3C", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:20:E0", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:21:5C", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:21:5D", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:21:6A", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:21:6B", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:22:FA", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:22:FB", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:24:D6", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:24:D7", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:26:C6", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:26:C7", vendor: "Intel Corporation", country: "US" },
  { prefix: "00:27:10", vendor: "Intel Corporation", country: "US" },
  
  // Cisco
  { prefix: "00:00:0C", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:42", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:43", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:63", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:64", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:96", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:97", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:C7", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:01:C9", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:16", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:17", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:3D", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:4A", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:4B", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:7D", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:7E", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:B9", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:BA", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:FC", vendor: "Cisco Systems, Inc", country: "US" },
  { prefix: "00:02:FD", vendor: "Cisco Systems, Inc", country: "US" },
  
  // Dell
  { prefix: "00:06:5B", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:08:74", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:0B:DB", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:0D:56", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:0F:1F", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:11:43", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:12:3F", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:13:72", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:14:22", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:15:C5", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:16:F0", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:18:8B", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:19:B9", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:1A:A0", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:1C:23", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:1D:09", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:1E:4F", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:1E:C9", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:21:70", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:21:9B", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:22:19", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:23:AE", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:24:E8", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:25:64", vendor: "Dell Inc.", country: "US" },
  { prefix: "00:26:B9", vendor: "Dell Inc.", country: "US" },
  
  // HP
  { prefix: "00:01:E6", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:01:E7", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:02:A5", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:04:EA", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:08:02", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:08:83", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0A:57", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0B:CD", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0D:9D", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0E:7F", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0F:20", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:0F:61", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:10:83", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:10:E3", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:11:0A", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:11:85", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:12:79", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:13:21", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:14:38", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:14:C2", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:15:60", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:16:35", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:17:08", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:17:A4", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:18:71", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:18:FE", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:19:BB", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:1A:4B", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:1B:78", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:1C:C4", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:1E:0B", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:1F:29", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:21:5A", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:22:64", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:23:7D", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:24:81", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:25:B3", vendor: "Hewlett Packard", country: "US" },
  { prefix: "00:26:55", vendor: "Hewlett Packard", country: "US" },
  
  // Huawei
  { prefix: "00:18:82", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:1E:10", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:25:68", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:25:9E", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:46:4B", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:5A:13", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:66:4B", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:9A:CD", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "00:E0:FC", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:02:1F", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:25:C5", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:33:89", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:4A:50", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:75:03", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:9F:CA", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:B0:E7", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:BD:70", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:C0:6F", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:F9:38", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  { prefix: "04:FE:8D", vendor: "Huawei Technologies Co.,Ltd", country: "CN" },
  
  // Xiaomi
  { prefix: "0C:1D:AF", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "14:F6:5A", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "18:59:36", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "28:6C:07", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "34:80:B3", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "38:A4:ED", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "58:44:98", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "64:09:80", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "64:B4:73", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "68:DF:DD", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "74:23:44", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "7C:1D:D9", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "8C:BE:BE", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "98:FA:E3", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "9C:99:A0", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "A8:6B:AD", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "AC:C1:EE", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "B0:E2:35", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "C4:6A:B7", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "D4:97:0B", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "F0:B4:29", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "F4:F5:E8", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  { prefix: "FC:64:BA", vendor: "Xiaomi Communications Co Ltd", country: "CN" },
  
  // Google
  { prefix: "00:1A:11", vendor: "Google, Inc.", country: "US" },
  { prefix: "3C:5A:B4", vendor: "Google, Inc.", country: "US" },
  { prefix: "54:60:09", vendor: "Google, Inc.", country: "US" },
  { prefix: "94:EB:2C", vendor: "Google, Inc.", country: "US" },
  { prefix: "F4:F5:D8", vendor: "Google, Inc.", country: "US" },
  { prefix: "F8:8F:CA", vendor: "Google, Inc.", country: "US" },
  
  // Microsoft
  { prefix: "00:03:FF", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:0D:3A", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:12:5A", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:15:5D", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:17:FA", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:1D:D8", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:22:48", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:25:AE", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "00:50:F2", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "28:18:78", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "30:59:B7", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "3C:83:75", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "50:1A:C5", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "58:82:A8", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "60:45:BD", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "7C:1E:52", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "7C:ED:8D", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "98:5F:D3", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "B4:0E:DE", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "C8:3F:26", vendor: "Microsoft Corporation", country: "US" },
  { prefix: "DC:B4:C4", vendor: "Microsoft Corporation", country: "US" },
  
  // TP-Link
  { prefix: "00:1D:0F", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "00:23:CD", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "00:27:19", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "14:CC:20", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "14:CF:92", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "14:E6:E4", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "18:A6:F7", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "1C:3B:F3", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "20:DC:E6", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "30:B5:C2", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "50:3E:AA", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "54:C8:0F", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "5C:63:BF", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "5C:89:9A", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "60:32:B1", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "64:66:B3", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "64:70:02", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "6C:B0:CE", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "78:A1:06", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "8C:21:0A", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "90:F6:52", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "94:0C:6D", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "98:DA:C4", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "A0:F3:C1", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "AC:84:C6", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "B0:4E:26", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "B0:95:75", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "C0:25:E9", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "C4:6E:1F", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "D4:6E:0E", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "D8:07:B6", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "E4:D3:32", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "E8:DE:27", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "EC:08:6B", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "EC:17:2F", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "F4:F2:6D", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  { prefix: "F8:1A:67", vendor: "TP-LINK TECHNOLOGIES CO.,LTD.", country: "CN" },
  
  // Netgear
  { prefix: "00:09:5B", vendor: "NETGEAR", country: "US" },
  { prefix: "00:0F:B5", vendor: "NETGEAR", country: "US" },
  { prefix: "00:14:6C", vendor: "NETGEAR", country: "US" },
  { prefix: "00:18:4D", vendor: "NETGEAR", country: "US" },
  { prefix: "00:1B:2F", vendor: "NETGEAR", country: "US" },
  { prefix: "00:1E:2A", vendor: "NETGEAR", country: "US" },
  { prefix: "00:1F:33", vendor: "NETGEAR", country: "US" },
  { prefix: "00:22:3F", vendor: "NETGEAR", country: "US" },
  { prefix: "00:24:B2", vendor: "NETGEAR", country: "US" },
  { prefix: "00:26:F2", vendor: "NETGEAR", country: "US" },
  { prefix: "20:4E:7F", vendor: "NETGEAR", country: "US" },
  { prefix: "28:C6:8E", vendor: "NETGEAR", country: "US" },
  { prefix: "2C:B0:5D", vendor: "NETGEAR", country: "US" },
  { prefix: "30:46:9A", vendor: "NETGEAR", country: "US" },
  { prefix: "44:94:FC", vendor: "NETGEAR", country: "US" },
  { prefix: "4C:60:DE", vendor: "NETGEAR", country: "US" },
  { prefix: "6C:B0:CE", vendor: "NETGEAR", country: "US" },
  { prefix: "84:1B:5E", vendor: "NETGEAR", country: "US" },
  { prefix: "9C:3D:CF", vendor: "NETGEAR", country: "US" },
  { prefix: "A0:04:60", vendor: "NETGEAR", country: "US" },
  { prefix: "A0:21:B7", vendor: "NETGEAR", country: "US" },
  { prefix: "A4:2B:8C", vendor: "NETGEAR", country: "US" },
  { prefix: "B0:39:56", vendor: "NETGEAR", country: "US" },
  { prefix: "C0:3F:0E", vendor: "NETGEAR", country: "US" },
  { prefix: "C4:04:15", vendor: "NETGEAR", country: "US" },
  { prefix: "C4:3D:C7", vendor: "NETGEAR", country: "US" },
  { prefix: "CC:40:D0", vendor: "NETGEAR", country: "US" },
  { prefix: "E0:46:9A", vendor: "NETGEAR", country: "US" },
  { prefix: "E0:91:F5", vendor: "NETGEAR", country: "US" },
  { prefix: "E4:F4:C6", vendor: "NETGEAR", country: "US" },
  
  // Broadcom
  { prefix: "00:10:18", vendor: "Broadcom Limited", country: "US" },
  { prefix: "00:0A:F7", vendor: "Broadcom Limited", country: "US" },
  { prefix: "00:0D:0A", vendor: "Broadcom Limited", country: "US" },
  { prefix: "00:16:E6", vendor: "Broadcom Limited", country: "US" },
  { prefix: "00:19:86", vendor: "Broadcom Limited", country: "US" },
  { prefix: "00:1D:FE", vendor: "Broadcom Limited", country: "US" },
  
  // Raspberry Pi
  { prefix: "B8:27:EB", vendor: "Raspberry Pi Foundation", country: "GB" },
  { prefix: "DC:A6:32", vendor: "Raspberry Pi Trading Ltd", country: "GB" },
  { prefix: "E4:5F:01", vendor: "Raspberry Pi Trading Ltd", country: "GB" },
  
  // Amazon
  { prefix: "00:BB:3A", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "00:FC:8B", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "0C:47:C9", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "10:CE:A9", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "18:74:2E", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "34:D2:70", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "40:B4:CD", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "44:65:0D", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "50:F5:DA", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "68:54:FD", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "74:75:48", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "78:E1:03", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "84:D6:D0", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "A0:02:DC", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "AC:63:BE", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "B4:7C:9C", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "F0:27:2D", vendor: "Amazon Technologies Inc.", country: "US" },
  { prefix: "FC:65:DE", vendor: "Amazon Technologies Inc.", country: "US" },
];

export default function MACLookupPage() {
  const [macInput, setMacInput] = useState("");
  const [result, setResult] = useState<VendorInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [searchVendor, setSearchVendor] = useState("");

  const filteredVendors = useMemo(() => {
    if (!searchVendor.trim()) return [];
    const search = searchVendor.toLowerCase();
    const uniqueVendors = new Map<string, VendorInfo>();
    ouiDatabase.filter(v => 
      v.vendor.toLowerCase().includes(search)
    ).forEach(v => {
      if (!uniqueVendors.has(v.vendor)) {
        uniqueVendors.set(v.vendor, v);
      }
    });
    return Array.from(uniqueVendors.values()).slice(0, 10);
  }, [searchVendor]);

  const normalizeMac = (mac: string): string => {
    // Remove all separators and convert to uppercase
    return mac.replace(/[:\-.\s]/g, "").toUpperCase();
  };

  const formatMac = (mac: string): string => {
    const clean = normalizeMac(mac);
    if (clean.length < 6) return mac;
    return clean.match(/.{2}/g)?.join(":") || mac;
  };

  const isValidMac = (mac: string): boolean => {
    const clean = normalizeMac(mac);
    return /^[0-9A-F]{12}$/.test(clean);
  };

  const getOUIPrefix = (mac: string): string => {
    const clean = normalizeMac(mac);
    if (clean.length < 6) return "";
    const prefix = clean.substring(0, 6);
    return `${prefix.substring(0, 2)}:${prefix.substring(2, 4)}:${prefix.substring(4, 6)}`;
  };

  const lookupMac = () => {
    const cleanMac = normalizeMac(macInput);
    
    if (cleanMac.length < 6) {
      setError("Please enter at least the first 6 characters of a MAC address");
      setResult(null);
      setNotFound(false);
      return;
    }

    if (cleanMac.length === 12 && !isValidMac(macInput)) {
      setError("Invalid MAC address format");
      setResult(null);
      setNotFound(false);
      return;
    }

    setError("");
    
    const prefix = getOUIPrefix(macInput);
    const found = ouiDatabase.find(v => v.prefix.toUpperCase() === prefix.toUpperCase());
    
    if (found) {
      setResult(found);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const isUnicastMac = (mac: string): boolean => {
    const clean = normalizeMac(mac);
    if (clean.length < 2) return true;
    const firstByte = parseInt(clean.substring(0, 2), 16);
    return (firstByte & 0x01) === 0;
  };

  const isLocallyAdministered = (mac: string): boolean => {
    const clean = normalizeMac(mac);
    if (clean.length < 2) return false;
    const firstByte = parseInt(clean.substring(0, 2), 16);
    return (firstByte & 0x02) !== 0;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* MAC Lookup */}
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">MAC Address Lookup</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={macInput}
              onChange={(e) => setMacInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupMac()}
              placeholder="e.g., 00:1A:2B:3C:4D:5E or 001A2B3C4D5E"
              className="flex-1 px-4 py-3 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all font-mono"
            />
            <button
              onClick={lookupMac}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all"
            >
              Lookup
            </button>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Supports formats: 00:1A:2B:3C:4D:5E, 00-1A-2B-3C-4D-5E, 001A.2B3C.4D5E, or 001A2B3C4D5E
          </p>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-4 bg-[var(--background)] rounded-xl p-5 border border-[var(--border)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-xl font-semibold mb-1">{result.vendor}</div>
                  <div className="text-sm text-[var(--muted-foreground)] mb-3">
                    OUI Prefix: <span className="font-mono text-violet-400">{result.prefix}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-[var(--muted)] rounded-lg p-2">
                      <div className="text-xs text-[var(--muted-foreground)]">Country</div>
                      <div className="font-medium">{result.country || "N/A"}</div>
                    </div>
                    <div className="bg-[var(--muted)] rounded-lg p-2">
                      <div className="text-xs text-[var(--muted-foreground)]">Type</div>
                      <div className="font-medium">{isUnicastMac(macInput) ? "Unicast" : "Multicast"}</div>
                    </div>
                    <div className="bg-[var(--muted)] rounded-lg p-2">
                      <div className="text-xs text-[var(--muted-foreground)]">Administration</div>
                      <div className="font-medium">{isLocallyAdministered(macInput) ? "Local" : "Universal"}</div>
                    </div>
                  </div>
                </div>
              </div>
              {macInput.length >= 12 && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="text-sm text-[var(--muted-foreground)]">Full MAC Address:</div>
                  <div className="font-mono text-lg">{formatMac(macInput)}</div>
                </div>
              )}
            </div>
          )}

          {notFound && (
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm">
              <strong>Vendor not found.</strong> This could be a locally administered address, a virtual interface, or the OUI is not in our database. The first octet indicates it is{" "}
              {isLocallyAdministered(macInput) ? "locally administered" : "universally administered"} and{" "}
              {isUnicastMac(macInput) ? "unicast" : "multicast"}.
            </div>
          )}
        </div>

        {/* Vendor Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Search Vendors</label>
          <input
            type="text"
            value={searchVendor}
            onChange={(e) => setSearchVendor(e.target.value)}
            placeholder="Search by vendor name (e.g., Apple, Samsung)..."
            className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-transparent focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
          />
          
          {filteredVendors.length > 0 && (
            <div className="mt-3 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Vendor</th>
                    <th className="px-4 py-2 text-left font-medium">Sample OUI</th>
                    <th className="px-4 py-2 text-left font-medium">Country</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredVendors.map((vendor, idx) => (
                    <tr key={idx} className="hover:bg-[var(--muted)]/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{vendor.vendor}</td>
                      <td className="px-4 py-3 font-mono text-violet-400">{vendor.prefix}</td>
                      <td className="px-4 py-3">{vendor.country || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MAC Format Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <h3 className="font-medium mb-2">MAC Address Format</h3>
            <div className="text-sm text-[var(--muted-foreground)] space-y-1">
              <p><strong>OUI (First 3 bytes):</strong> Identifies the manufacturer</p>
              <p><strong>NIC (Last 3 bytes):</strong> Device-specific identifier</p>
            </div>
          </div>
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <h3 className="font-medium mb-2">Address Types</h3>
            <div className="text-sm text-[var(--muted-foreground)] space-y-1">
              <p><strong>Bit 0 of 1st byte:</strong> 0 = Unicast, 1 = Multicast</p>
              <p><strong>Bit 1 of 1st byte:</strong> 0 = Universal, 1 = Local</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-400 text-sm flex gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <strong>100% Client-Side:</strong> This tool uses a built-in OUI database with {ouiDatabase.length} entries from major manufacturers. All lookups are performed locally in your browser - no data is sent to any server.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
