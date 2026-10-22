const files=import.meta.glob('../content/blog/*.md',{eager:true});
export const posts=Object.entries(files).filter(([,post]:any)=>!post.frontmatter.draft).map(([file,post]:any)=>({...post.frontmatter,slug:file.split('/').pop().replace(/\.md$/,''),Content:post.Content})).sort((a,b)=>b.date.localeCompare(a.date));
