<p>《ROS2理论与实践》系列课程主要由基础篇、核心篇、应用篇、进阶篇以及项目库五部分组成。本阶段为《ROS2理论与实践——核心篇》课程，核心篇课程设计以官方内容为标准，主要介绍ROS2中的通信机制与开发者工具，其中前者是整个ROS2框架中的核心构成，而后者则为开发者能够高效的构建应用程序提供有力支持。本阶段课程目的是帮助大家快速上手ROS2，为后续进阶奠定基础。</p>
<h4 id="1&#x8BFE;&#x7A0B;&#x5185;&#x5BB9;">1.&#x8BFE;&#x7A0B;&#x5185;&#x5BB9;</h4>
<p>&#x672C;&#x9636;&#x6BB5;&#x6559;&#x7A0B;&#x4E3B;&#x8981;&#x5185;&#x5BB9;&#x5982;&#x4E0B;&#xFF1A;</p>
<table>
<thead>
<tr>
<th style="text-align:left"><strong>&#x7AE0;&#x8282;</strong></th>
<th style="text-align:left"><strong>&#x5B66;&#x4E60;&#x5185;&#x5BB9;</strong></th>
<th style="text-align:left"><strong>&#x5B66;&#x4E60;&#x6536;&#x83B7;</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">&#x7B2C;1&#x7AE0; ROS2&#x6982;&#x8FF0;&#x4E0E;&#x73AF;&#x5883;&#x642D;&#x5EFA;</td>
<td style="text-align:left">ROS2&#x76F8;&#x5173;&#x6982;&#x5FF5;&#x4EE5;&#x53CA;&#x5982;&#x4F55;&#x4F7F;&#x7528;VScode&#x642D;&#x5EFA;&#x96C6;&#x6210;&#x5F00;&#x53D1;&#x73AF;&#x5883;&#x3002;</td>
<td style="text-align:left">&#x80FD;&#x591F;&#x4E86;&#x89E3;ROS2&#xFF0C;&#x4E86;&#x89E3;&#x5DE5;&#x4F5C;&#x4E2D;&#x5E38;&#x7528;&#x7684;&#x6A21;&#x5757;&#x6709;&#x54EA;&#x4E9B;&#xFF0C;&#x5E76;&#x53EF;&#x4EE5;&#x81EA;&#x884C;&#x642D;&#x5EFA;&#x5BF9;&#x5F00;&#x53D1;&#x8005;&#x53CB;&#x597D;&#x7684;&#x5B66;&#x4E60;&#x3001;&#x5DE5;&#x4F5C;&#x73AF;&#x5883;&#x3002;</td>
</tr>
<tr>
<td style="text-align:left">&#x7B2C;2&#x7AE0; ROS2&#x901A;&#x4FE1;&#x673A;&#x5236;&#x6838;&#x5FC3;</td>
<td style="text-align:left">ROS2&#x4E2D;&#x9891;&#x7E41;&#x4F7F;&#x7528;&#x7684;&#x901A;&#x4FE1;&#x673A;&#x5236;&#xFF08;&#x8BDD;&#x9898;&#x3001;&#x670D;&#x52A1;&#x3001;&#x52A8;&#x4F5C;&#x3001;&#x53C2;&#x6570;&#xFF09;&#x7684;&#x5E94;&#x7528;&#x573A;&#x666F;&#x4EE5;&#x53CA;&#x5B9E;&#x73B0;&#x3002;</td>
<td style="text-align:left">&#x8BE5;&#x90E8;&#x5206;&#x4E0E;&#x5DE5;&#x4F5C;&#x5185;&#x5BB9;&#x9AD8;&#x5EA6;&#x5951;&#x5408;&#xFF0C;&#x53EF;&#x4EE5;&#x8BA9;&#x5F00;&#x53D1;&#x8005;&#x6839;&#x636E;&#x4E0D;&#x540C;&#x573A;&#x666F;&#x3001;&#x4E0D;&#x540C;&#x9700;&#x6C42;&#x7075;&#x6D3B;&#x5B9E;&#x73B0;&#x673A;&#x5668;&#x4EBA;&#x7CFB;&#x7EDF;&#x4E2D;&#x7684;&#x6570;&#x636E;&#x4EA4;&#x4E92;&#x3002;</td>
</tr>
<tr>
<td style="text-align:left">&#x7B2C;3&#x7AE0; ROS2&#x901A;&#x4FE1;&#x673A;&#x5236;&#x8865;&#x5145;</td>
<td style="text-align:left">ROS2&#x4E2D;&#x4E00;&#x4E9B;&#x96F6;&#x6563;&#x4F46;&#x6BD4;&#x8F83;&#x5B9E;&#x7528;&#x7684;&#x77E5;&#x8BC6;&#x70B9;&#x3002;</td>
<td style="text-align:left">&#x907F;&#x514D;&#x7A0B;&#x5E8F;&#x201C;&#x9677;&#x9631;&#x201D;&#xFF0C;&#x5B8C;&#x5584;&#x901A;&#x4FE1;&#x673A;&#x5236;&#x7684;&#x5E94;&#x7528;&#x3002;</td>
</tr>
<tr>
<td style="text-align:left">&#x7B2C;4&#x7AE0; ROS2&#x5DE5;&#x5177;&#x4E4B;launch&#x4E0E;rosbag2</td>
<td style="text-align:left">launch&#x6587;&#x4EF6;&#x4E0E;rosbag2&#x5F55;&#x5236;&#x3001;&#x56DE;&#x653E;&#x8BDD;&#x9898;&#x6D88;&#x606F;&#x3002;</td>
<td style="text-align:left">&#x901A;&#x8FC7;launch&#x80FD;&#x591F;&#x4E3A;&#x5927;&#x578B;&#x9879;&#x76EE;&#x6784;&#x5EFA;&#x542F;&#x52A8;&#x6587;&#x4EF6;&#xFF1B;&#x901A;&#x8FC7;rosbag2&#x80FD;&#x591F;&#x590D;&#x7528;&#x3001;&#x751F;&#x4EA7;&#x6570;&#x636E;&#xFF0C;&#x964D;&#x4F4E;&#x5F00;&#x53D1;&#x6210;&#x672C;&#xFF0C;&#x63D0;&#x9AD8;&#x5F00;&#x53D1;&#x6548;&#x7387;&#xFF0C;&#x7F29;&#x77ED;&#x4EA7;&#x54C1;&#x843D;&#x5730;&#x65F6;&#x95F4;&#x3002;</td>
</tr>
<tr>
<td style="text-align:left">&#x7B2C;5&#x7AE0; ROS2&#x5DE5;&#x5177;&#x4E4B;&#x5750;&#x6807;&#x53D8;&#x6362;</td>
<td style="text-align:left">tf&#x5750;&#x6807;&#x53D8;&#x6362;&#x3002;</td>
<td style="text-align:left">&#x901A;&#x8FC7;&#x5750;&#x6807;&#x53D8;&#x6362;&#x53EF;&#x4EE5;&#x786E;&#x5B9A;&#x673A;&#x5668;&#x4EBA;&#x4E0D;&#x540C;&#x90E8;&#x4EF6;&#x6216;&#x4E0D;&#x540C;&#x673A;&#x5668;&#x4EBA;&#x4E4B;&#x95F4;&#x7684;&#x4F4D;&#x59FF;&#x5173;&#x7CFB;&#xFF0C;&#x65E0;&#x8BBA;&#x662F;&#x5355;&#x673A;&#x5668;&#x4EBA;&#x8FD8;&#x662F;&#x591A;&#x673A;&#x5668;&#x4EBA;&#x7EC4;&#x961F;&#x90FD;&#x6709;&#x7740;&#x5E7F;&#x6CDB;&#x5E94;&#x7528;&#x3002;</td>
</tr>
<tr>
<td style="text-align:left">&#x7B2C;6&#x7AE0; ROS2&#x5DE5;&#x5177;&#x4E4B;&#x53EF;&#x89C6;&#x5316;</td>
<td style="text-align:left">rviz2&#x4E09;&#x7EF4;&#x53EF;&#x89C6;&#x5316;&#x5DE5;&#x5177;&#x548C;URDF&#x673A;&#x5668;&#x4EBA;&#x5EFA;&#x6A21;&#x3002;</td>
<td style="text-align:left">&#x53EF;&#x4EE5;&#x521B;&#x5EFA;&#x673A;&#x5668;&#x4EBA;&#x6A21;&#x578B;&#xFF0C;&#x5E76;&#x53EF;&#x4EE5;&#x56FE;&#x5F62;&#x5316;&#x663E;&#x793A;ROS2&#x7CFB;&#x7EDF;&#x4E2D;&#x7684;&#x62BD;&#x8C61;&#x6570;&#x636E;&#xFF0C;&#x8BA9;&#x5F00;&#x53D1;&#x8005;&#x4EE5;&#x673A;&#x5668;&#x4EBA;&#x7684;&#x89C6;&#x89D2;&#x770B;&#x4E16;&#x754C;&#x3002;</td>
</tr>
</tbody>
</table>

<h4 id="4&#x53C2;&#x8003;&#x8D44;&#x6599;">4.&#x53C2;&#x8003;&#x8D44;&#x6599;</h4>
<p><strong>ROS2&#x5B98;&#x7F51;&#x94FE;&#x63A5;&#xFF1A;</strong><a href="https://www.ros.org/" target="_blank">https://www.ros.org/</a></p>