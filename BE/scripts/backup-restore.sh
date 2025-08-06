#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🗄️  Database Backup & Restore Script${NC}"
echo "=================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Docker is running${NC}"
}

# Function to backup database
backup_db() {
    echo -e "${YELLOW}📦 Creating database backup...${NC}"
    
    # Create backup directory if it doesn't exist
    mkdir -p ./backups
    
    # Create backup with timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="./backups/todo_app_backup_${TIMESTAMP}.sql"
    
    # Create backup
    docker-compose exec -T db pg_dump -U postgres todo_app > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backup created successfully: ${BACKUP_FILE}${NC}"
        echo -e "${BLUE}📊 Backup size: $(du -h "$BACKUP_FILE" | cut -f1)${NC}"
    else
        echo -e "${RED}❌ Backup failed${NC}"
        exit 1
    fi
}

# Function to restore database
restore_db() {
    if [ -z "$1" ]; then
        echo -e "${RED}❌ Please provide backup file path${NC}"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}❌ Backup file not found: ${BACKUP_FILE}${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🔄 Restoring database from backup...${NC}"
    echo -e "${BLUE}📁 Backup file: ${BACKUP_FILE}${NC}"
    
    # Stop backend to prevent conflicts
    docker-compose stop backend
    
    # Restore database
    docker-compose exec -T db psql -U postgres -d todo_app -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    docker-compose exec -T db psql -U postgres -d todo_app < "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database restored successfully${NC}"
        
        # Restart backend
        docker-compose start backend
        echo -e "${GREEN}✅ Backend restarted${NC}"
    else
        echo -e "${RED}❌ Restore failed${NC}"
        exit 1
    fi
}

# Function to list backups
list_backups() {
    echo -e "${YELLOW}📋 Available backups:${NC}"
    
    if [ ! -d "./backups" ] || [ -z "$(ls -A ./backups 2>/dev/null)" ]; then
        echo -e "${BLUE}No backups found${NC}"
        return
    fi
    
    for backup in ./backups/*.sql; do
        if [ -f "$backup" ]; then
            SIZE=$(du -h "$backup" | cut -f1)
            DATE=$(stat -c %y "$backup" | cut -d' ' -f1)
            TIME=$(stat -c %y "$backup" | cut -d' ' -f2 | cut -d'.' -f1)
            echo -e "${BLUE}📁 $(basename "$backup")${NC}"
            echo -e "   📅 Date: ${DATE} ${TIME}"
            echo -e "   📊 Size: ${SIZE}"
            echo ""
        fi
    done
}

# Function to show help
show_help() {
    echo "Usage: $0 {backup|restore|list|help}"
    echo ""
    echo "Commands:"
    echo "  backup              - Create a new database backup"
    echo "  restore <file>      - Restore database from backup file"
    echo "  list                - List available backups"
    echo "  help                - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 backup"
    echo "  $0 restore ./backups/todo_app_backup_20241203_143022.sql"
    echo "  $0 list"
}

# Main script logic
case "${1:-help}" in
    "backup")
        check_docker
        backup_db
        ;;
    "restore")
        check_docker
        restore_db "$2"
        ;;
    "list")
        list_backups
        ;;
    "help"|*)
        show_help
        ;;
esac 