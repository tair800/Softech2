CREATE TABLE IF NOT EXISTS BlogSections (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BlogId INTEGER NOT NULL,
    Title TEXT NOT NULL,
    TitleEn TEXT,
    TitleRu TEXT,
    Description TEXT,
    DescriptionEn TEXT,
    DescriptionRu TEXT,
    OrderIndex INTEGER NOT NULL,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (BlogId) REFERENCES Blogs(Id) ON DELETE CASCADE
);
