import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  // 获取 public 目录下的 sitemap.xml 的路径
  const filePath = path.join(process.cwd(), 'public', 'sitemap.xml');

  try {
    // 读取 sitemap.xml 文件内容
    const fileContent = await fs.readFile(filePath, 'utf8');

    // 返回文件内容作为响应，设置正确的 Content-Type 为 application/xml
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    // 如果文件读取失败，返回 404 错误
    return new NextResponse('Sitemap not found', { status: 404 });
  }
}
