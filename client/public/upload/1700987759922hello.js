export class AuthorSearch {
    numFound: number; // Số lượng tìm thấy\
    start: number; // Index phần tử đầu tiên
    numFoundExact: boolean;
    docs: DocAbout Author[];
}
  

export class DocAboutAuthor {
key: string;
type: string;
name: string;
alternate_names?: string[]; 
birth_date?: string;
death_date?: string;
top_work: string;
work_count: number;
top_subjects?: string[];
_version_: number;
}
export class AuthorDetail {

name: string; 
personal_name: string;
death_date: string;
alternate_names: string[];
created: CreatedTime; 
last_modified: CreatedTime;
latest_revision: number; 
key: string;
birth_date: string;
revision: number;
type: string;
remote_ids: RemoteIDS; // Có thể bỏ qua
}

export class CreatedTime {

type: string;
value: Date;
}
export class RemoteIDS {
viaf: string;
wikidata: string;
isni: string;
}
export class AuthorWorks {

links: Links;
size: number; // Size của trang
entries: WorksEntry[];
} // Data các tác phẩm
export class Links {

self: string; // Link call API Trang hiện tại 
author: string; // Link call API Trang Author 
next: string; // Link call API Trang tiếp theo
}
export class WorksEntry {
type: string;
title: string;
subjects: string[]; // Chuyên ngành của tác phẩm
subject people: string[];
authors: Author[];
key: string;
latest_revision: number;
revision: number;
created: CreatedTime;
last_modified: CreatedTime;
}
export class Author {
type: {key: string; };
author: {key: string; }; // Link tới author
}